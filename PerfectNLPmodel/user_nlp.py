# user_nlp.py

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from spellchecker import SpellChecker
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

tfidf_vectorizer = TfidfVectorizer()
fitted_tfidf_vectorizer = None


def process_user_input(user_input, processed_dataset=None):
    global fitted_tfidf_vectorizer

    # Spell-checking
    spell = SpellChecker()
    misspelled = spell.unknown(user_input.split())
    corrected_input = " ".join(
        spell.correction(word) if word in misspelled else word
        for word in user_input.split()
    )

    # Tokenization
    tokens = word_tokenize(corrected_input)

    # Stopword Removal
    stop_words = set(stopwords.words("english"))
    filtered_tokens = [word for word in tokens if word.lower() not in stop_words]

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]

    # Feature Extraction using TF-IDF
    if fitted_tfidf_vectorizer is None:
        fitted_tfidf_vectorizer = joblib.load("fitted_tfidf_vectorizer.pkl")

    # Check if lemmatized_tokens is not None before using it
    if lemmatized_tokens:
        tfidf_matrix = fitted_tfidf_vectorizer.transform([" ".join(lemmatized_tokens)])
        return tfidf_matrix
    else:
        print("Lemmatized tokens are None.")
        return None
