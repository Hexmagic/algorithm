import * as vscode from 'vscode';
import path = require('path');
import { workspace, languages, window, commands, ExtensionContext, Disposable, debug } from 'vscode';
import { CodelensProvider } from './provider/codelensProvider';
import { testCodeCommand, buildCodeCommand, submitCommand, freshCommand, switchEndpointCommand, signInCommand, switchCodeLangCommand, debugCodeCommand, getDescriptionCommand, searchCommand, memoFilePreviewCommand, addFolderCommand, addMemoFileCommand, removeMemoFileCommand } from './commands';
import { QuestionsProvider } from './provider/questionsProvider';
import { createQuestionPanelCommand } from './webview/questionPreview';
import { config, onChangeConfig } from './config';
import { tag } from 'pretty-tag'
import { registerForSnippetProviders } from './provider/snippetProvider';
import { registerDebug } from './debug/launch'
import { registerCompletionItemProvider } from './provider/completionProvider';
import { MemoProvider } from './provider/memoProvider'
export function activate(context: vscode.ExtensionContext) {
	const subscriptions = context.subscriptions;
	registerCompletionItemProvider(context)
	registerForSnippetProviders(context)
	registerDebug()
	const codelensProvider = new CodelensProvider();

	languages.registerCodeLensProvider("*", codelensProvider);
	const questionsProvider = new QuestionsProvider(vscode.workspace.workspaceFolders, context.extensionPath);
	const memoProvider = new MemoProvider()
	subscriptions.push(commands.registerCommand("algorithm.testCode", testCodeCommand));
	subscriptions.push(commands.registerCommand('algorithm.debugCode', debugCodeCommand))
	subscriptions.push(commands.registerCommand("algorithm.buildCode", buildCodeCommand.bind(null, context)))
	subscriptions.push(commands.registerCommand("algorithm.submit", submitCommand.bind(null, questionsProvider)))
	subscriptions.push(commands.registerCommand("algorithm.getDescription", getDescriptionCommand.bind(null, context.extensionPath)))
	subscriptions.push(commands.registerCommand('algorithm.questionPreview', createQuestionPanelCommand.bind(null, context.extensionPath)))
	subscriptions.push(commands.registerCommand("algorithm.refreshQuestions", freshCommand.bind(null, questionsProvider)))
	subscriptions.push(commands.registerCommand('algorithm.switchEndpoint', switchEndpointCommand.bind(null, questionsProvider)))
	subscriptions.push(commands.registerCommand('algorithm.signIn', signInCommand))
	subscriptions.push(commands.registerCommand('algorithm.switchCodeLang', switchCodeLangCommand.bind(null, questionsProvider)))
	subscriptions.push(commands.registerCommand("algorithm.search", searchCommand))
	subscriptions.push(commands.registerCommand('algorithm.memoFilePreview', memoFilePreviewCommand))
	subscriptions.push(commands.registerCommand('algorithm.addFolder', addFolderCommand.bind(null, memoProvider)))
	subscriptions.push(commands.registerCommand('algorithm.addMemoFile', addMemoFileCommand.bind(null, memoProvider)))
	subscriptions.push(commands.registerCommand('algorithm.removeMemoFile', removeMemoFileCommand.bind(null, memoProvider)))
	vscode.window.createTreeView('questions', { treeDataProvider: questionsProvider, showCollapseAll: true })
	vscode.window.createTreeView('memo', { treeDataProvider: memoProvider, showCollapseAll: true })
	subscriptions.push(vscode.workspace.onDidChangeConfiguration(onChangeConfig.bind(null, questionsProvider)));
}