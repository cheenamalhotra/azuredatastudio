/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResolvedKeybinding, Keybinding } from 'vs/base/common/keybindings';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';

export interface IKeyboardMapper {
	dumpDebugInfo(): string;
	resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
	resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
}

export class CachedKeyboardMapper implements IKeyboardMapper {

	private _actual: IKeyboardMapper;
	private _cache: Map<string, ResolvedKeybinding[]>;

	constructor(actual: IKeyboardMapper) {
		this._actual = actual;
		this._cache = new Map<string, ResolvedKeybinding[]>();
	}

	public dumpDebugInfo(): string {
		return this._actual.dumpDebugInfo();
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		return this._actual.resolveKeyboardEvent(keyboardEvent);
	}

	public resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[] {
		const hashCode = keybinding.getHashCode();
		const resolved = this._cache.get(hashCode);
		if (!resolved) {
			const r = this._actual.resolveKeybinding(keybinding);
			this._cache.set(hashCode, r);
			return r;
		}
		return resolved;
	}
}
