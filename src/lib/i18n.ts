// filepath: /Users/evgenijcervev/my_projects/kami-app-frontend/src/lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
	en: {
		translation: {
			home: 'Home',
			profile: 'Profile',
			main: 'Main Section',
		},
	},
	ru: {
		translation: {
			home: 'Главная',
			profile: 'Профиль',
			main: 'Основной раздел',
		},
	},
}

i18n.use(initReactI18next).init({
	resources,
	lng: 'ru', // Set default language to Russian
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
