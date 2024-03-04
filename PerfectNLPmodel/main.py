# main.py

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import joblib
from user_nlp import process_user_input
from dataset_nlp import process_dataset, acquire_user_input, identify_dataset


def main():
    user_input = acquire_user_input()
    dataset_path = identify_dataset(user_input)

    if dataset_path:
        dataset_tfidf_matrix, _ = process_dataset(dataset_path)
        joblib.dump(dataset_tfidf_matrix, "dataset_tfidf_matrix.pkl")
    else:
        print("No relevant dataset found.")
        return

    user_tfidf_matrix = process_user_input(user_input)

    # Load the dataset tfidf matrix
    dataset_tfidf_matrix = joblib.load("dataset_tfidf_matrix.pkl")

    similarity_scores = cosine_similarity(user_tfidf_matrix, dataset_tfidf_matrix)
    top_indices = np.argsort(similarity_scores[0])[-2:][::-1]

    dataset = pd.read_csv(dataset_path, encoding="ISO-8859-1")
    found_suitable_answer = False
    print("Most Similar Answers:")
    for idx in top_indices:
        if similarity_scores[0][idx] > 0.5:
            print(
                "========================================================================="
            )
            print(f"\t\tAnswer {idx}, Similarity Score: {similarity_scores[0][idx]}")
            print(f"\n{dataset['Answer'][idx]}")
            print(
                "========================================================================="
            )
            found_suitable_answer = True

    if not found_suitable_answer:
        print("No suitable answer in the dataset.")


if __name__ == "__main__":
    main()
