import os
import re

nome_jogo = os.environ.get("NOME_JOGO", "").strip()
link1 = os.environ.get("LINK1", "").strip()
nome2 = os.environ.get("NOME2", "").strip()
link2 = os.environ.get("LINK2", "").strip()

if not nome_jogo:
    nome_jogo = "download"

# Gera o link .html a partir do nome do jogo limpo de espaços
slug_clean = re.sub(r'[^a-z0-9\-]', '', nome_jogo.lower().replace(' ', '-'))
slug_clean = re.sub(r'-+', '-', slug_clean).strip('-')
if not slug_clean:
    slug_clean = "download"

filename = f"{slug_clean}.html"
foto_url = "https://i.ibb.co/bxdr44V/image-downloader-1787418859773.jpg"

titulo1 = nome_jogo
titulo2 = nome2 if nome2 else "Arquivo Secundário"

links_data = [
    (titulo1, link1),
    (titulo2, link2)
]

downloads_html = ""
has_downloads = False

for texto, link in links_data:
    if link:
        has_downloads = True
        downloads_html += f'''
      <a href="{link}" target="_blank" class="btn btn-download">
        <div class="btn-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
        <div class="btn-content">
          <span class="btn-title">{texto}</span>
          <span class="btn-subtitle">Clique para baixar o arquivo</span>
        </div>
      </a>
'''

download_section_html = ""
if has_downloads:
    download_section_html = f'''
    <div class="download-section">
      <div class="section-divider">
        <span>ÁREA DE DOWNLOAD</span>
      </div>
      {downloads_html}
    </div>
'''

html_content = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>k404modapk - Downloads</title>
  <style>
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }}

    body {{
      background-color: #f8fafc;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 100vh;
      padding: 36px 16px 28px;
    }}

    .container {{
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}

    .profile {{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }}

    .profile-img {{
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #ffffff;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    }}

    .profile-name {{
      font-size: 1.4rem;
      font-weight: 800;
      margin-top: 14px;
      color: #0f172a;
      letter-spacing: -0.02em;
    }}

    .links-wrapper {{
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }}

    .btn {{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 16px 18px;
      border-radius: 18px;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }}

    .btn:active {{
      transform: scale(0.98);
    }}

    .btn-icon {{
      width: 34px;
      height: 34px;
      flex-shrink: 0;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .btn-content {{
      display: flex;
      flex-direction: column;
      text-align: left;
    }}

    .btn-title {{
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.25;
    }}

    .btn-subtitle {{
      font-size: 0.82rem;
      margin-top: 2px;
    }}

    .btn-instagram {{
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(220, 39, 67, 0.22);
    }}
    .btn-instagram .btn-subtitle {{
      color: rgba(255, 255, 255, 0.9);
    }}

    .btn-youtube {{
      background-color: #FF0000;
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(255, 0, 0, 0.22);
    }}
    .btn-youtube .btn-subtitle {{
      color: rgba(255, 255, 255, 0.9);
    }}

    .download-section {{
      margin-top: 28px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }}

    .section-divider {{
      display: flex;
      align-items: center;
      text-align: center;
      margin-bottom: 4px;
    }}

    .section-divider span {{
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #64748b;
      width: 100%;
    }}

    .btn-download {{
      background: #ffffff;
      color: #0f172a;
      border: 2px solid #e2e8f0;
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    }}

    .btn-download:hover {{
      border-color: #2563eb;
    }}

    .btn-download .btn-title {{
      color: #0f172a;
    }}

    .btn-download .btn-subtitle {{
      color: #64748b;
    }}

    footer {{
      margin-top: 40px;
    }}

    .footer-link {{
      font-size: 0.88rem;
      color: #64748b;
      text-decoration: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .footer-link:hover {{
      color: #0f172a;
    }}
  </style>
</head>
<body>

  <div class="container">

    <div class="profile">
      <img src="{foto_url}" alt="k404modapk" class="profile-img">
      <h1 class="profile-name">k404modapk</h1>
    </div>

    <div class="links-wrapper">

      <a href="https://www.instagram.com/kennedy_morgy" target="_blank" class="btn btn-instagram">
        <div class="btn-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <div class="btn-content">
          <span class="btn-title">Seguir no Instagram</span>
          <span class="btn-subtitle">@kennedy_morgy</span>
        </div>
      </a>

      <a href="https://www.youtube.com/@K404Oficial" target="_blank" class="btn btn-youtube">
        <div class="btn-icon">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#ffffff">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div class="btn-content">
          <span class="btn-title">Inscrever-se no Canal</span>
          <span class="btn-subtitle">@K404Oficial</span>
        </div>
      </a>

{download_section_html}

    </div>
  </div>

  <footer>
    <a href="https://k-404modapk.blogspot.com" target="_blank" class="footer-link">
      🌐 k-404modapk.blogspot.com
    </a>
  </footer>

</body>
</html>
'''

with open(filename, "w", encoding="utf-8") as f:
    f.write(html_content)

site_url = f"https://kennedymorgy.github.io/api-downloads/{filename}"

print("\n" + "="*60)
print("🚀 PÁGINA GERADA COM SUCESSO!")
print("👉 LINK DO SEU SITE PARA COPIAR:")
print(site_url)
print("="*60 + "\n")

summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
if summary_file:
    with open(summary_file, "a", encoding="utf-8") as sf:
        sf.write("### 🚀 PÁGINA GERADA COM SUCESSO!\n\n")
        sf.write(f"👉 **Link do seu jogo:**\n`{site_url}`\n")
