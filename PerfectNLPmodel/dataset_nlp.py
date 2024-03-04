# dataset_nlp.py

import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from user_nlp import process_user_input  # Import the function from user_nlp

tfidf_vectorizer = TfidfVectorizer()
fitted_tfidf_vectorizer = None


def acquire_user_input():
    return input("Enter your question: ")


def identify_dataset(user_input):
    programming_languages = ["cpp", "python", "c", "java", "javascript", "php"]
    dataset_paths = {
        "cpp": "cpp_dataset.csv",
        "python": "python_dataset.csv",
        "c": "c_dataset.csv",
        "java": "java_dataset.csv",
        "javascript": "javascript_dataset.csv",
        "php": "php_dataset.csv",
    }

    for lang in programming_languages:
        if lang in user_input.lower():
            return dataset_paths.get(lang)

    return None


def process_dataset(dataset_path):
    global fitted_tfidf_vectorizer

    # Load the dataset
    dataset = pd.read_csv(dataset_path, encoding="ISO-8859-1")

    # Tokenization, Stopword Removal, and Lemmatization
    processed_questions = []
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words("english"))

    for question in dataset["Question"]:
        # Tokenization
        tokens = word_tokenize(question)

        # Stopword Removal
        filtered_tokens = [word for word in tokens if word.lower() not in stop_words]

        # Lemmatization
        lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]

        processed_questions.append(" ".join(lemmatized_tokens))

    # Feature Extraction using TF-IDF
    if fitted_tfidf_vectorizer is None:
        fitted_tfidf_vectorizer = tfidf_vectorizer.fit(processed_questions)
        joblib.dump(fitted_tfidf_vectorizer, "fitted_tfidf_vectorizer.pkl")

    fitted_tfidf_vectorizer = joblib.load("fitted_tfidf_vectorizer.pkl")

    tfidf_matrix = fitted_tfidf_vectorizer.transform(processed_questions)

    return tfidf_matrix, processed_questions


if __name__ == "__main__":
    user_input = acquire_user_input()
    dataset_path = identify_dataset(user_input)

    if dataset_path:
        dataset_tfidf_matrix, processed_dataset = process_dataset(dataset_path)
        joblib.dump(processed_dataset, "processed_dataset.pkl")

        # Now, pass the user input and processed dataset to the user_nlp module
        from user_nlp import process_user_input

        user_tfidf_matrix = process_user_input(user_input, processed_dataset)
    else:
        print("No relevant dataset found.")
