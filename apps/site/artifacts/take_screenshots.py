import os
from playwright.sync_api import sync_playwright

def take_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        
        pages = [
            {"name": "home", "url": "http://localhost:5173/"},
            {"name": "servicos", "url": "http://localhost:5173/servicos"},
            {"name": "orcamento", "url": "http://localhost:5173/orcamento"},
            {"name": "agendar", "url": "http://localhost:5173/agendar"},
            {"name": "acompanhar", "url": "http://localhost:5173/acompanhar"}
        ]
        
        output_dir = "artifacts/screenshots"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        for p_info in pages:
            print(f"Capturing {p_info['name']}...")
            page.goto(p_info['url'])
            page.wait_for_load_state('networkidle')
            page.screenshot(path=f"{output_dir}/{p_info['name']}.png", full_page=True)
            
        browser.close()

if __name__ == "__main__":
    take_screenshots()
