import os
import sys
from pathlib import Path
from PyQt6.QtCore import QUrl
from PyQt6.QtWidgets import QApplication
from PyQt6.QtWebEngineWidgets import QWebEngineView

def get_resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

if __name__ == '__main__':
    app = QApplication(sys.argv)

    web = QWebEngineView()
    web.setWindowTitle("Calculadora de Juros Compostos")
    web.resize(420, 680)

    html_path = Path(get_resource_path(os.path.join("web", "index.html"))).resolve()
    web.load(QUrl.fromLocalFile(str(html_path)))

    web.show()
    sys.exit(app.exec())