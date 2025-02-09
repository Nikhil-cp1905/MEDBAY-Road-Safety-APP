import osmnx as ox
import networkx as nx
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points on Earth."""
    R = 6371  # Earth's radius in kilometers
    
    # Convert latitude and longitude to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def find_shortest_path(lat, lon, accident_lat, accident_lng):
    try:
        print("Loading graph data...")
        G = ox.graph_from_point((lat, lon), dist=10000, network_type="drive")
        print(f"Graph loaded with {len(G.nodes)} nodes and {len(G.edges)} edges.")

        # Find nearest nodes
        hospital_node = ox.nearest_nodes(G, lon, lat)
        accident_node = ox.nearest_nodes(G, accident_lng, accident_lat)
        
        print(f"\nHospital Node: {hospital_node}")
        print(f"Accident Node: {accident_node}")

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
                    path = algo(G, hospital_node, accident_node)
                    break
                except nx.NetworkXNoPath:
                    continue
            else:
                print("No path found between hospital and accident location.")
                return None

            # Extract path coordinates
            path_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in path]
            
            # Print out the path details
            print("\nShortest Path Details:")
            print("Total Path Nodes:", len(path))
            print("Path Coordinates:")
            for i, coord in enumerate(path_coords):
                print(f"Node {i+1}: Latitude {coord[0]}, Longitude {coord[1]}")
            
            return path_coords

        except Exception as path_error:
            print(f"Path finding error: {path_error}")
            return None

    except Exception as e:
        print(f"Error: {e}")
        return None

# Coordinates for Tambaram, Chennai
lat, lon = 12.9716, 77.5946

# Example accident location
accident_lat, accident_lng = 12.9073, 80.1538

# Find and print the shortest path
find_shortest_path(lat, lon, accident_lat, accident_lng)
