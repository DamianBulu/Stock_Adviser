import google.generativeai as genai
import sys

# 1. Configurare API Key
# NOTĂ DE SECURITATE: Nu este recomandat să ții cheia API direct în cod dacă distribui scriptul.
# Pentru uz personal/testare este ok, dar ai grijă să nu o postezi public.
API_KEY = 'AIzaSyClioDz6ksmmdsuGyQD1XAvcquOzX5N2po'

try:
    genai.configure(api_key=API_KEY)
except Exception as e:
    print(f"Eroare la configurarea API Key: {e}")
    sys.exit(1)


def start_chatbot():
    # 2. Inițializarea modelului
    # Folosim 'gemini-1.5-flash' pentru că este rapid și eficient pentru chat.
    # Poți schimba cu 'gemini-1.5-pro' pentru raționamente mai complexe.
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        print(f"Eroare la inițializarea modelului: {e}")
        sys.exit(1)

    # 3. Începerea sesiunii de chat (păstrează istoricul)
    chat_session = model.start_chat(history=[])

    print("------------------------------------------------------")
    print("🤖 Gemini Chatbot este activat!")
    print("Scrie 'exit', 'quit' sau 'pa' pentru a închide.")
    print("------------------------------------------------------\n")

    while True:
        # 4. Preluarea input-ului de la utilizator
        try:
            user_input = input("\033[1;34mTu:\033[0m ")  # Text albastru pentru utilizator
        except KeyboardInterrupt:
            print("\nLa revedere!")
            break

        # Condiții de ieșire
        if user_input.lower() in ['exit', 'quit', 'pa', 'stop']:
            print("\033[1;32mGemini:\033[0m La revedere! O zi frumoasă.")
            break

        if not user_input.strip():
            continue

        # 5. Trimiterea mesajului și primirea răspunsului
        try:
            # stream=True permite afișarea textului pe măsură ce este generat (efect de scriere)
            response = chat_session.send_message(user_input, stream=True)

            print("\033[1;32mGemini:\033[0m ", end="")  # Text verde pentru AI

            for chunk in response:
                print(chunk.text, end="", flush=True)
            print("\n")  # Linie nouă la final

        except Exception as e:
            print(f"\n[Eroare API]: {e}")
            print("Încearcă din nou sau verifică conexiunea/kota API.\n")


if __name__ == "__main__":
    start_chatbot()