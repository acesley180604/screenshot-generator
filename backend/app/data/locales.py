"""Supported locales for App Store localization"""

LOCALES = {
    "en": {"code": "en", "name": "English", "native_name": "English", "rtl": False},
    "es": {"code": "es", "name": "Spanish", "native_name": "Español", "rtl": False},
    "es-mx": {"code": "es-mx", "name": "Spanish (Mexico)", "native_name": "Español (México)", "rtl": False},
    "fr": {"code": "fr", "name": "French", "native_name": "Français", "rtl": False},
    "de": {"code": "de", "name": "German", "native_name": "Deutsch", "rtl": False},
    "it": {"code": "it", "name": "Italian", "native_name": "Italiano", "rtl": False},
    "pt": {"code": "pt", "name": "Portuguese (Portugal)", "native_name": "Português", "rtl": False},
    "pt-br": {"code": "pt-br", "name": "Portuguese (Brazil)", "native_name": "Português (Brasil)", "rtl": False},
    "ja": {"code": "ja", "name": "Japanese", "native_name": "日本語", "rtl": False},
    "ko": {"code": "ko", "name": "Korean", "native_name": "한국어", "rtl": False},
    "zh-hans": {"code": "zh-hans", "name": "Chinese (Simplified)", "native_name": "简体中文", "rtl": False},
    "zh-hant": {"code": "zh-hant", "name": "Chinese (Traditional)", "native_name": "繁體中文", "rtl": False},
    "ar": {"code": "ar", "name": "Arabic", "native_name": "العربية", "rtl": True},
    "nl": {"code": "nl", "name": "Dutch", "native_name": "Nederlands", "rtl": False},
    "ru": {"code": "ru", "name": "Russian", "native_name": "Русский", "rtl": False},
    "tr": {"code": "tr", "name": "Turkish", "native_name": "Türkçe", "rtl": False},
    "th": {"code": "th", "name": "Thai", "native_name": "ไทย", "rtl": False},
    "vi": {"code": "vi", "name": "Vietnamese", "native_name": "Tiếng Việt", "rtl": False},
    "id": {"code": "id", "name": "Indonesian", "native_name": "Bahasa Indonesia", "rtl": False},
    "ms": {"code": "ms", "name": "Malay", "native_name": "Bahasa Melayu", "rtl": False},
    "hi": {"code": "hi", "name": "Hindi", "native_name": "हिन्दी", "rtl": False},
    "pl": {"code": "pl", "name": "Polish", "native_name": "Polski", "rtl": False},
    "sv": {"code": "sv", "name": "Swedish", "native_name": "Svenska", "rtl": False},
    "no": {"code": "no", "name": "Norwegian", "native_name": "Norsk", "rtl": False},
    "da": {"code": "da", "name": "Danish", "native_name": "Dansk", "rtl": False},
    "fi": {"code": "fi", "name": "Finnish", "native_name": "Suomi", "rtl": False},
    "el": {"code": "el", "name": "Greek", "native_name": "Ελληνικά", "rtl": False},
    "cs": {"code": "cs", "name": "Czech", "native_name": "Čeština", "rtl": False},
    "ro": {"code": "ro", "name": "Romanian", "native_name": "Română", "rtl": False},
    "hu": {"code": "hu", "name": "Hungarian", "native_name": "Magyar", "rtl": False},
    "uk": {"code": "uk", "name": "Ukrainian", "native_name": "Українська", "rtl": False},
    "he": {"code": "he", "name": "Hebrew", "native_name": "עברית", "rtl": True},
    "sk": {"code": "sk", "name": "Slovak", "native_name": "Slovenčina", "rtl": False},
    "ca": {"code": "ca", "name": "Catalan", "native_name": "Català", "rtl": False},
    "hr": {"code": "hr", "name": "Croatian", "native_name": "Hrvatski", "rtl": False},
}

def get_all_locales():
    """Get all supported locales"""
    return list(LOCALES.values())

def get_locale(code: str):
    """Get a specific locale by code"""
    return LOCALES.get(code)

def is_rtl_locale(code: str) -> bool:
    """Check if a locale is right-to-left"""
    locale = LOCALES.get(code)
    return locale["rtl"] if locale else False
