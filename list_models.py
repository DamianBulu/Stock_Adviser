import google.generativeai as genai
import sys

# Cheia ta API
API_KEY = 'AIzaSyClioDz6ksmmdsuGyQD1XAvcquOzX5N2po'

try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"Eroare la configurarea API Key: {e}")
    sys.exit(1)


def start_chatbot():
    print("Se inițializează Gemini 2.5 Flash...")
    try:
        # FOLOSIM MODELUL EXISTENT ÎN LISTA TA
        model = genai.GenerativeModel('models/gemini-2.5-flash')
    except Exception as e:
        print(f"Eroare la inițializarea modelului: {e}")
        sys.exit(1)

    # Începem chat-ul
    chat_session = model.start_chat(history=[])

    print("------------------------------------------------------")
    print("🚀 Gemini 2.5 Chatbot este gata!")
    print("Scrie 'exit' pentru a închide.")
    print("------------------------------------------------------\n")

    while True:
        try:
            user_input = input("\033[1;34mTu:\033[0m ")
        except KeyboardInterrupt:
            break

        if user_input.lower() in ['exit', 'quit', 'pa']:
            print("\033[1;32mGemini:\033[0m La revedere!")
            break

        if not user_input.strip():
            continue

        try:
            response = chat_session.send_message(user_input, stream=True)
            print("\033[1;32mGemini:\033[0m ", end="")
            for chunk in response:
                print(chunk.text, end="", flush=True)
            print("\n")
        except Exception as e:
            print(f"\n[Eroare]: {e}")


if __name__ == "__main__":
    start_chatbot()