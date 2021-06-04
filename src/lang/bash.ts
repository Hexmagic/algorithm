import { log, config } from '../config'
import { OutputChannel } from 'vscode'
import { getFileComment } from '../common/langConfig'
import { BaseLang } from './base'
import * as vscode from 'vscode'
import { readFileAsync, TestCase, TestCaseParam, writeFileAsync, execFileAsync, CaseList } from '../common/util'
import { getFuncNames, parseTestCase, TestResult, handleMsg } from '../common/util'

export class BashParse {
	public log: OutputChannel
	public originCode?: string
	public commentToken = '#'
	constructor(public filePath: string, public text?: string) {
		this.log = log
		if (!filePath) {
			throw new Error('filePath must not empty')
		}
		if (text) {
			this.originCode = text
		}
	}
	async getOriginCode() {
		if (this.originCode) {
			return this.originCode
		}
		const originCode = await readFileAsync(this.filePath, {
			encoding: 'utf8',
		})
		this.originCode = originCode
		return this.originCode
	}
	public async buildCode() {
		const originCode = await this.getOriginCode()
		const { questionMeta } = getFuncNames(originCode, this.filePath)

		const code = originCode
			.split('\n')
			.filter((line) => !this.isComment(line))
			.join('\n')
		return {
			code,
			questionMeta,
		}
	}
	isComment(line: string): boolean {
		return line.trim().startsWith('#')
	}
}
