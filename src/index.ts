import joplin from 'api';
import { SettingItemType , ToolbarButtonLocation, MenuItemLocation, ContentScriptType } from 'api/types';


const CONTENT_SCRIPT_FILE_NAME = 'formatpainter.js';
const CONTENT_SCRIPT_ID = 'format-painter';

const CODEMIRROR_PLUGIN_NAME = 'toggleFormatPainter'; 

const COMMAND_NAME = 'toggle-painter';
const COMMAND_LABEL = 'Toggle Format Painter';

const MENU_ITEM_ID = 'toggle.format.painter';
const BUTTON_ID = 'toggle_format_painter';


joplin.plugins.register({
	onStart: async function() {
		//let format_painter_enable = false;
		/*function toggle_format_painter(){
			format_painter_enable = !format_painter_enable;
			//console.log(config._fore);
			return format_painter_enable;
		}*/

		//Settings 
		await joplin.settings.registerSection('settings.formatpainter', {
			label: 'Format Painter',
		});

		await joplin.settings.registerSettings({
			'foretext': {
				value: "",
				type: SettingItemType.String,
				section: 'settings.formatpainter',
				public: true,
				label: 'add before the text'
			},
			'endtext': {
				value: "",
				type: SettingItemType.String,
				section: 'settings.formatpainter',
				public: true,
				label: 'add after the text'
			}
		});


		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			CONTENT_SCRIPT_ID,
			'./' + CONTENT_SCRIPT_FILE_NAME
		);

		await joplin.commands.register({
			name: COMMAND_NAME,
			label: COMMAND_LABEL,
			iconName: 'fas fa-paint-roller',
			execute: async () => {
				await joplin.commands.execute('editor.execCommand', {
					name: CODEMIRROR_PLUGIN_NAME,
					args: [await joplin.settings.value('foretext'),await joplin.settings.value('endtext')/*,toggle_format_painter()*/] // fore,end enable/disable
				});
			},
		});


		await joplin.views.toolbarButtons.create(BUTTON_ID, COMMAND_NAME, ToolbarButtonLocation.EditorToolbar);

		await joplin.views.menuItems.create(MENU_ITEM_ID, 
		COMMAND_NAME, MenuItemLocation.Edit, 
		{ accelerator: 'Ctrl+Shift+C' });
		
	}
});