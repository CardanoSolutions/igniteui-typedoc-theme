import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as process from 'process';
import * as path from 'path';

import { DefaultTheme } from 'typedoc';
import { PageEvent} from 'typedoc/dist/lib/output/events';
import { ContextAwareRendererComponent as ctxAwareRender } from 'typedoc/dist/lib/output/components'
import { MarkedPlugin } from 'typedoc/dist/lib/output/plugins/MarkedPlugin'
import { Renderer } from 'typedoc';

export default class EnvironmentLinkSetup extends DefaultTheme {

    constructor(renderer: Renderer, basePath) {
        super(renderer, basePath);
        Handlebars.registerHelper('getConfigData', this.getConfigData);
        // MarkedPlugin.ini
        // Handlebars.registerHelper('relativeUrl', url ? ctxAwareRender.getRelativeUrl(url) : url);
    }

    private getConfigData(prop: string, lang) {
        const fileName = 'config.json';
        let settings;
        let config;
        let data;

        if (this instanceof PageEvent) {
            settings = this.settings;
        }

        if (settings && fs.existsSync(settings.theme)) {
            const normalizedPath = path.join(settings.theme, fileName);
            config = JSON.parse(fs.readFileSync(normalizedPath, 'utf8'));
        }

        const getLang = lang.name ? settings.localize : lang;
        if (config && getLang && process.env.NODE_ENV) {
            data = config[getLang][process.env.NODE_ENV.trim()];
        }

        return data ? data[prop] : '';
    }
}
