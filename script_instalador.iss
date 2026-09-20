#define MyAppName "Calculadora de Juros Compostos"
#define MyAppVersion "1.0"
#define MyAppPublisher "Anderson"
#define MyAppURL "https://www.example.com"
#define MyAppExeName "main.exe"

[Setup]
AppId={{FC8444F2-2316-4E3E-958D-1170EA06DFD8}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
UninstallDisplayIcon={app}\{#MyAppExeName}
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
OutputBaseFilename=Calculadora-Juros-Compostos-Setup
SetupIconFile=C:\Users\ander\OneDrive\Área de Trabalho\Meus projetos\Calculadora de Juros Compostos\icon.ico
SolidCompression=yes
WizardStyle=modern dynamic

[Languages]
Name: "english"; MessagesFile: "compiler:default.isl"
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "C:\Users\ander\OneDrive\Área de Trabalho\Meus projetos\Calculadora de Juros Compostos\dist\main\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\ander\OneDrive\Área de Trabalho\Meus projetos\Calculadora de Juros Compostos\dist\main\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "C:\Users\ander\OneDrive\Área de Trabalho\Meus projetos\Calculadora de Juros Compostos\icon.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename: "{app}\icon.ico"