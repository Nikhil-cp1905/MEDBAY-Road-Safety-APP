from flask import Flask, jsonify, request
from flask_cors import CORS
import osmnx as ox
import networkx as nx

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Define the place to load the graph
place_name = "Bangalore South, Bengaluru Urban, Karnataka, 560076, India"

# Load the graph
try:
    print("Loading graph data...")
    G = ox.graph_from_place(place_name, network_type="drive")
    print(f"Graph loaded with {len(G.nodes)} nodes and {len(G.edges)} edges.")
except Exception as e:
    print(f"Error loading graph: {e}")
    G = None  # Ensure the app doesn't crash if graph loading fails

@app.route('/api/path', methods=['GET'])
def get_path():
    if G is None:
        return jsonify({"error": "Graph data could not be loaded. Please check the backend setup."}), 500
    try:
        # Get start (hospital) and end (accident) coordinates
        hospital_lat = request.args.get('hospitalLat', type=float)
        hospital_lng = request.args.get('hospitalLng', type=float)
        accident_lat = request.args.get('accidentLat', type=float)
        accident_lng = request.args.get('accidentLng', type=float)
        if not all([hospital_lat, hospital_lng, accident_lat, accident_lng]):
            return jsonify({"error": "Missing or invalid coordinates"}), 400

        # Validate coordinates are within graph bounds
        graph_bounds = (
            min(node['y'] for node in G.nodes.values()),
            max(node['y'] for node in G.nodes.values()),
            min(node['x'] for node in G.nodes.values()),
            max(node['x'] for node in G.nodes.values())
        )
        if not (graph_bounds[0] <= hospital_lat <= graph_bounds[1] and
                graph_bounds[2] <= hospital_lng <= graph_bounds[3]):
            return jsonify({"error": "Hospital coordinates are outside the graph bounds"}), 400
        if not (graph_bounds[0] <= accident_lat <= graph_bounds[1] and
                graph_bounds[2] <= accident_lng <= graph_bounds[3]):
            return jsonify({"error": "Accident coordinates are outside the graph bounds"}), 400

        # Find nearest nodes
        hospital_node = ox.nearest_nodes(G, hospital_lng, hospital_lat)
        accident_node = ox.nearest_nodes(G, accident_lng, accident_lat)

        # Compute the shortest path using A*
        try:
            path = nx.astar_path(
                G,
                hospital_node,
                accident_node,
                heuristic=lambda u, v: ox.distance.euclidean_dist_vec(
                    G.nodes[u]['y'], G.nodes[u]['x'], G.nodes[v]['y'], G.nodes[v]['x']
                )
            )
        except nx.NetworkXNoPath:
            return jsonify({"error": "No path exists between the specified points"}), 404

        # Extract path coordinates
        path_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path]
        return jsonify(path_coords)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
