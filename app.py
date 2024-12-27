from flask import Flask, render_template, send_from_directory
import os

# Initialize Flask app
app = Flask(__name__, static_folder='public', template_folder='public')

# Path to content.txt file
CONTENT_FILE_PATH = "public/content.txt"

# Ensure the content.txt file exists
if not os.path.exists(CONTENT_FILE_PATH):
    with open(CONTENT_FILE_PATH, 'w') as file:
        file.write("Initial content in content.txt")

@app.route('/')
def index():
    """Render the main page to view content.txt without authentication"""
    with open(CONTENT_FILE_PATH, 'r') as file:
        content = file.read()
    return render_template('index.html', content=content)

# Serve content.txt file (this is the key route to fix the 404 error)
@app.route('/content.txt')
def serve_content():
    return send_from_directory('public', 'content.txt')

# Serve static files (e.g., script.js, style.css, etc.)
@app.route('/public/<path:filename>')
def serve_static(filename):
    return send_from_directory('public', filename)

# Run the application with hosting
if __name__ == "__main__":
    # Host the app on localhost with debugging enabled (default port 5000)
    app.run(debug=True, host='0.0.0.0', port=5000)
