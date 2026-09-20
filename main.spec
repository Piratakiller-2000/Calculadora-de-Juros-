# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('web', 'web'),
        ('icon.ico', '.')
    ],
    hiddenimports=['PyQt6.QtWebEngineWidgets'],
    excludes=['pythonnet', 'clr', 'clr_loader'],
    noarchive=False,
)
pyz = PYZ(a.pure)
exe = EXE(pyz, a.scripts, exclude_binaries=True, name='main', console=False, icon=['icon.ico'])
coll = COLLECT(exe, a.binaries, a.datas, name='main')