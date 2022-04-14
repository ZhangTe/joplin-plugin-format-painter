import joplin from 'api';

joplin.plugins.register({
	onStart: async function() {
		console.info('Plugin Started Successfully');
		// Later, this is where you'll want to update the TOC
		async function updateTocView() {
			// Get the current note from the workspace.
			const note = await joplin.workspace.selectedNote();

			// Keep in mind that it can be `null` if nothing is currently selected!
			if (note) {
				console.info('Note content has changed! New note is:', note);
			} else {
				console.info('No note is selected');
			}
		}

		// This event will be triggered when the user selects a different note
		await joplin.workspace.onNoteSelectionChange(() => {
			updateTocView();
		});

		// This event will be triggered when the content of the note changes
		// as you also want to update the TOC in this case.
		await joplin.workspace.onNoteChange(() => {
			updateTocView();
		});

		// Also update the TOC when the plugin starts
		updateTocView();
	},
});
