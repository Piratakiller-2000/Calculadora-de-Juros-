# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('web', 'web'),
        ('icon.ico', '.')
    ],
    hiddenimports=['webview'],
    excludes=['PyQt6'], # O pythonnet já não está excluído aqui
    noarchive=False,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz, 
    a.scripts, 
    exclude_binaries=True, 
    name='CalculadoraDeJuros', 
    console=False, 
    icon=['icon.ico']
)
coll = COLLECT(
    exe, 
    a.binaries, 
    a.datas, 
    name='CalculadoraDeJuros'
)