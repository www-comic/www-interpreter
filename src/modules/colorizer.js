let EU;

const api = {
    env: require.async ? 'web' : 'node',
    loaded: false,
    english: function (text='') {
        if(!EU) {
            return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
        }
        return EU.generateColorizedHTMLForEnglish(text);
    }
};
if(require.async) {
    require.async('@colorizer/english-dictionary').then(async (dict) => {
        EU = await require.async('@colorizer/english-utils')(dict);
        api.loaded = true;
    });
} else {
    EU = require('@colorizer/english-utils')(require('@colorizer/english-dictionary'));
    api.loaded = true;
}

module.exports = api;
