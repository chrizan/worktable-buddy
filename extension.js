// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This is the webserver stuff
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('worktable-buddy.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		startRestApi()

	});

	context.subscriptions.push(disposable);
}

function startRestApi() {

	app.use(bodyParser.json())
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	)

	app.get('/', (request, response) => {
		response.json({ info: 'Worktable Buddy is up and running!' })
	})

	app.post('/', (request, response) => {
		let infoMsg = `Received message ${request.body.message}`
		vscode.window.showInformationMessage(infoMsg)
		let lineNumber = getLineNumber(request.body.message)
		focusLine(lineNumber)
		response.json({ info: 'So far so good!' })
	})

	app.listen(port, () => {
		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated
		console.log(`Congratulations, your Worktable Buddy is now active and listening on port ${port}.`)
	})
}

function getLineNumber(message) {
	let document = vscode.window.activeTextEditor.document;
	let index = document.getText().indexOf(message);
	let lineNumber = document.positionAt(index).line;
	return lineNumber + 1;
}

function focusLine(lineNumber) {
	let editor = vscode.window.activeTextEditor;
	let range = editor.document.lineAt(lineNumber - 1).range;
	editor.selection = new vscode.Selection(range.start, range.end);
	editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
