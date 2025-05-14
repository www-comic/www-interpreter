let EU;

const api = {
    env: require.async ? 'web' : 'node',
    loaded: false,
    english: function (text='') {
        if(!text) return '';
        if(!EU) return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
        return EU.generateColorizedHTMLForEnglish(text);
    },
    gnome: function (text='') {
        if(!text) return '';
        const GNOME_SPECIAL_NOUNS = [];
        const GNOME_SPECIAL_VERBS = [];
        const GNOME_HONORIFICS = [];
        const GNOME_MISPELLINGS = [];
        const GNOME_FOREIGN = [];
        const GNOME_KNOWN_NAMES = [];
        const GNOME_SLANG = ['fq', 'fqq'];
        const words = text.match(/\w+|\s+|[^\w\s]/g);
        let output = '';
        words.forEach(word => {
            let unknown = false;
            output += "<span class=''ifd-text";
            if(GNOME_MISPELLINGS.includes(word)) output += ' ifd-error';
            if(GNOME_FOREIGN.includes(word)) output += ' ifd-foriegn';
            if(" .,/\\?:;0123456789[](){}|~`'\"+=_-".split('').includes(word)) {
                output += ' ifd-noun';
            } else if(GNOME_SPECIAL_NOUNS.includes(word.toLowerCase())) {
                output += ' ifd-noun';
            } else if(GNOME_SPECIAL_VERBS.includes(word.toLowerCase())) {
                output += ' ifd-verb';
            } else if('-san/-chan/-kun/-sana/-senpai'.split('/').includes(word.toLowerCase())) {
                output += ' ifd-honorific ifd-foriegn'
            } else if(GNOME_KNOWN_NAMES.includes(word.toLowerCase())) {
                output += ' ifd-proper-noun';
            } else if(GNOME_HONORIFICS.includes(word.toLowerCase())) {
                output += ' ifd-honorific';
            } else if(GNOME_SLANG.includes(word.toLowerCase())) {
                output += ' ifd-exclamation'
            } else if(word.toLowerCase().endsWithAny([
                'qaq',
                'qasha',
                'qacha',
                'qe',
                'qana',
                'qashana',
                'qachana',
                'qena'
            ])) {
                output += ' ifd-verb';
            } else if(word.toLowerCase().endsWithAny(['a', 'an'])) {
                output += ' ifd-noun';
            } else if(word.toLowerCase().endsWith('iqo')) {
                // This was correct... right?
                output += ' ifd-adjective';
            } else if(word.toLowerCase().endsWith('iqa')) {
                // This was correct... right?
                output += ' ifd-adverb';
            } else {
                output += ' ifd-proper-noun';
                if(word[0].toUpperCase() != word[0]) {
                    unknown = true;
                }
            }
            output += '\'';
            if(unknown) output += ' data-label="This word is assumed to be a proper noun."';
            output += '>';
            output += word.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
            output += '</span>'
        });
        return output;
    }
}
if(false) {
    // testing
    require.async('@colorizer/english-dictionary').then(async (dict) => {
        EU = await require.async('@colorizer/english-utils')(dict);
        api.loaded = true;
    });
} else {
    EU = require('@colorizer/english-utils')(require('@colorizer/english-dictionary'));
    api.loaded = true;
}

module.exports = api;
