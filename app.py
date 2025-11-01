import gradio as gr
from huggingface_hub import InferenceClient

client = InferenceClient("HuggingFaceH4/zephyr-7b-beta")

def chat(message, history):
    history = history or []
    prompt = "\n".join([f"User: {u}\nAI: {a}" for u, a in history])
    prompt += f"\nUser: {message}\nAI:"
    response = client.text_generation(
        prompt,
        max_new_tokens=250,
        temperature=0.7,
        do_sample=True,
    )
    history.append((message, response))
    return response, history

gr.ChatInterface(
    fn=chat,
    title="Hewad AI Chatbot",
    description="Multilingual chatbot (Dari / English / German)",
).).launch(share=True)
