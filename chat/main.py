from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load FAQ csv
faq_df = pd.read_csv('plant_faq.csv')

# TF-IDF setup
vectorizer = TfidfVectorizer()
faq_tfidf = vectorizer.fit_transform(faq_df['question']) 

app = Flask(__name__)
CORS(app)    # enable CORS for all routes

def retrieve_answer(user_query, top_k=1, threshold=0.2):
    query_vec = vectorizer.transform([user_query])
    cosine_sim = cosine_similarity(query_vec, faq_tfidf).flatten()

    top_indices = np.argsort(cosine_sim)[::-1][:top_k]
    results = []
    for idx in top_indices:
        results.append({
            "question": faq_df.iloc[idx]['question'],
            "answer": faq_df.iloc[idx]['answer'],
            "score": float(cosine_sim[idx])
        })

    if results[0]["score"] < threshold:
        return [{"question": user_query, "answer": "Sorry, I don't know the answer to that plant problem.", "score": 0.0}]
    return results
@app.route('/ask', methods=["POST"])
def ask():
    data = request.json
    query = data.get("query", "")
    response = retrieve_answer(query)
    return jsonify(response)

@app.route("/health", method = ["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 3000, debug = True)