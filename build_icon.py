import os
from PIL import Image

def preparar_icones():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir = os.path.join(current_dir, "web")
    os.makedirs(web_dir, exist_ok=True)

    # Procura por icon.png, icon.jpg ou icon.jpeg na raiz
    input_image = None
    for nome in ["icon.png", "icon.jpg", "icon.jpeg"]:
        caminho = os.path.join(current_dir, nome)
        if os.path.exists(caminho):
            input_image = caminho
            break

    if not input_image:
        print("❌ Ficheiro de imagem não encontrado na raiz do projeto.")
        return False

    try:
        with Image.open(input_image) as img:
            img_rgba = img.convert("RGBA")
            
            # Copia a versão PNG para a pasta web
            web_png_path = os.path.join(web_dir, "icon.png")
            img_rgba.save(web_png_path, format="PNG")

            # Cria o ícone .ico nativo para o Windows
            ico_path = os.path.join(current_dir, "icon.ico")
            img_rgba.save(
                ico_path,
                format="ICO",
                sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
            )

        print(f"✅ Sucesso! Ícone gerado a partir de: {os.path.basename(input_image)}")
        print("✅ Ficheiro 'icon.ico' criado na raiz do projeto.")
        return True

    except Exception as e:
        print(f"❌ Erro ao converter a imagem: {e}")
        return False

if __name__ == "__main__":
    preparar_icones()