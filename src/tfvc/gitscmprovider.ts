/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { TfvcCommandNames } from "../helpers/constants";
import { scm, Disposable, SourceControl } from "vscode";
import { ExtensionManager } from "../extensionmanager";
import { IScmProvider } from "./interfaces";

/**
 * This class provides the SCM implementation for Git.
 */
export class GitSCMProvider implements IScmProvider {
    public static scmScheme: string = "git";

    private _extensionManager: ExtensionManager;
    private _sourceControl: SourceControl;
    private _disposables: Disposable[] = [];

    constructor(extensionManager: ExtensionManager) {
        this._extensionManager = extensionManager;
    }

    Initialize(): Promise<void> {

        // Now that everything is setup, we can register the provider and set up our singleton instance
        // This registration can only happen once
        this._sourceControl = scm.createSourceControl(GitSCMProvider.scmScheme, "Git");
        this._disposables.push(this._sourceControl);

        //Set the command to run when user accepts changes via Ctrl+Enter in input box.
        this._sourceControl.acceptInputCommand = { command: TfvcCommandNames.Checkin, title: "Checkin" };
        return Promise.resolve();
    }

    Reinitialize(): Promise<void> {
        return Promise.resolve();
    }

    appendToCheckinMessage(message: string) {
        const previousMessage = this._sourceControl.inputBox.value;
        if (previousMessage) {
            this._sourceControl.inputBox.value = previousMessage + "\n" + message;
        } else {
            this._sourceControl.inputBox.value = message;
        }
    }

    dispose(): void {
        if (this._disposables) {
            this._disposables.forEach((d) => d.dispose());
            this._disposables = [];
        }
    }
}
