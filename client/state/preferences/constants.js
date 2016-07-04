export const USER_SETTING_KEY = 'calypso_preferences';
export const DEFAULT_PREFERENCES = {
	'editor-mode': {
		schema: { 'enum': [ null, 'html', 'tinymce' ] },
		'default': null
	},
	firstViewDisabledViews: {
		schema: { type: 'array', items: { type: 'string' } },
		'default': []
	},
	mediaModalGalleryInstructionsDismissed: {
		schema: { type: 'boolean' },
		'default': false
	},
	mediaModalGalleryInstructionsDismissedForSession: {
		schema: null, //We only want to store this preference for current session. mediaModalGalleryInstructionsDismissed is the version stored in api and localStorage
		'default': false
	}
};
