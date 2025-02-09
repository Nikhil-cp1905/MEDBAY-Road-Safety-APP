from flask import Flask, jsonify, request
from flask_cors import CORS
import osmnx as ox
import networkx as nx
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in kilometers
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Define the coordinates for the map center
lat, lon = 12.9716, 77.5946  # Coordinates for Tambaram, Chennai

# Load the graph
try:
    print("Loading graph data...")
    G = ox.graph_from_point((lat, lon), dist=10000, network_type="drive")
    print(f"Graph loaded with {len(G.nodes)} nodes and {len(G.edges)} edges.")
except Exception as e:
    print(f"Error loading graph: {e}")
    G = None  # Ensure the app doesn't crash if graph loading fails

@app.route('/api/path', methods=['GET'])
def get_path():
    if G is None:
        return jsonify({"error": "Graph data could not be loaded. Please check the backend setup."}), 500
    
    try:
        # Get accident coordinates from request
        accident_lat = float(request.args.get('accidentLat'))
        accident_lng = float(request.args.get('accidentLng'))

        # Find nearest nodes
        hospital_node = ox.nearest_nodes(G, lon, lat)
        accident_node = ox.nearest_nodes(G, accident_lng, accident_lat)
        
        # Check if nodes are in the same connected component
        try:
            # Try finding a path using different algorithms
            algorithms = [
                nx.shortest_path,
                nx.dijkstra_path,
                nx.bellman_ford_path
            ]
            
            for algo in algorithms:
                try:
                    path = algo(G, hospital_node, accident_node, weight='length')
                    break
                except nx.NetworkXNoPath:
                    continue
            else:
                return jsonify({"error": "No path exists between the specified points"}), 404

            # Extract path coordinates
            path_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path]
            # Print out the path details
            print("\nShortest Path Details:")
            print("Total Path Nodes:", len(path))
            print("Path Coordinates:")
            for i, coord in enumerate(path_coords):
                print(f"Node {i+1}: Latitude {coord[0]}, Longitude {coord[1]}")

            return jsonify(path_coords)

        except Exception as path_error:
            # Fall back to using haversine distance heuristic if other methods fail
            try:
                path = nx.astar_path(
                    G,
                    hospital_node,
                    accident_node,
                    heuristic=lambda u, v: haversine_distance(
                        G.nodes[u]['y'], G.nodes[u]['x'], 
                        G.nodes[v]['y'], G.nodes[v]['x']
                    )
                )
                path_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path]
                return jsonify(path_coords)
            except Exception as e:
                return jsonify({"error": f"Path finding error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
