import joplin from 'api';
import { ContentScriptType } from 'api/types';
import { MenuItemLocation } from 'api/types';

const ContentScriptID = 'format-painter';

joplin.plugins.register({
	onStart: async function() {
		console.info('Match Highlighter started!');

		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			'matchHighlighter',
			'./joplinMatchHighlighter.js'
		);

		await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			ContentScriptID, //contentscript id
			'./formatpainter.js'
		);

		await joplin.commands.register({
			name: 'paint',
			label: 'paint the selected text',
			execute: async () => {
				await joplin.commands.execute('editor.execCommand', {
					name: 'printSomething',
					args: ['Anything']
				});
			},
		});
/*
		await joplin.views.menuItems.create('printSomethingButton', 
			'printSomething', MenuItemLocation.Tools, 
			{ accelerator: 'Ctrl+Alt+Shift+U' });*/
		
		
	},
});