from setuptools import setup

APP = ['tutor_menubar.py']
DATA_FILES = ['icon.png']
OPTIONS = {
    'argv_emulation': False,
    'iconfile': None,
    'plist': {
        'CFBundleName': 'AI English Tutor',
        'CFBundleDisplayName': 'AI English Tutor',
        'CFBundleIdentifier': 'com.inseokko.ai-english-tutor',
        'CFBundleVersion': '1.0.0',
        'LSUIElement': True,  # Hide from Dock (menu bar only)
    },
    'packages': ['rumps'],
}

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
