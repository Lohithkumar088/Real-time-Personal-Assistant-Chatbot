from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Enables Cross-Origin Resource Sharing
from huggingface_hub import InferenceClient  # Import Hugging Face API
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Hugging Face InferenceClient
client = InferenceClient(
    api_key="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"  # Replace with your actual Hugging Face API key
)

@app.route('/')
def home():
    return render_template("index.html")

# Define the /chat endpoint
@app.route('/chat', methods=['POST'])
def handle_chat():
    try:
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        if not data or 'query' not in data:
            return jsonify({'error': 'Query is required.'}), 400

        query = data['query'].strip()
        logging.debug(f"User query: {query}")

        if not query:
            return jsonify({'error': 'Empty query received.'}), 400

        model_name = "meta-llama/Llama-3.2-3B-Instruct"

        prompt = f"User: {query}\nAssistant:"

        completion = client.text_generation(
            model=model_name,
            prompt=prompt,
            max_new_tokens=150,  # Shorter responses
            temperature=0.7,  # Adjust randomness
            top_p=0.9,  # Sampling method
            stop_sequences=["User:"],  # Ensure the response stops cleanly
        )

        logging.debug(f"API Response: {completion}")

        generated_text = completion.strip().split("\n")[0]

        return jsonify({'result': generated_text})

    except Exception as e:
        logging.error(f"Error processing request: {e}", exc_info=True)
        return jsonify({'error': f"Server error: {str(e)}"}), 500


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
