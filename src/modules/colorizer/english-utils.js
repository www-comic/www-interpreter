module.exports = function ({ ENGLISH_NOUNS, ENGLISH_PROPER_NOUNS, ENGLISH_HONORIFICS, ENGLISH_VERBS, ENGLISH_ADJECTIVES, ENGLISH_ADVERBS, ENGLISH_PARTICLES, ENGLISH_MISTAKES, ENGLISH_FORIEGN, ENGLISH_ALL }) {
    const ARRAY_INCLUDES = Object.getOwnPropertyDescriptor(Array.prototype, 'includes');

    Object.defineProperty(ENGLISH_NOUNS, 'includes', {
        value: function (t) {
            if(!t) return false;
            return ARRAY_INCLUDES.value.apply(this, [t]);
        }
    });

    Object.defineProperty(ENGLISH_VERBS, 'includes', {
        value: function (t) {
            if(!t) return false;
            return ARRAY_INCLUDES.value.apply(this, [t]);
        }
    });

    Object.defineProperty(ENGLISH_ADJECTIVES, 'includes', {
        value: function (t) {
            if(!t) return false;
            return ARRAY_INCLUDES.value.apply(this, [t]);
        }
    });

    Object.defineProperty(ENGLISH_ADVERBS, 'includes', {
        value: function (t) {
            if(!t) return false;
            return ARRAY_INCLUDES.value.apply(this, [t]);
        }
    });

    function matchEnglish(text="") {
        const words = text.match(/\w+|\s+|[^\w\s]/g);
        const contractionHalfs = ['i', 'you', 'they', 'we', 'he', 'she', 'it', 'won', 'can', 'wouldn', 'shouldn', 'didn', 'ain', 'don'];
        const contractions = [
            'i\'m',
            'you\'re',
            'it\'s',
            'he\'s',
            'she\'s',
            'they\'re',
            'we\'re',
            'don\'t',
            'won\'t',
            'can\'t',
            'wouldn\'t',
            'shouldn\'t',
            'didn\'t',
            'ain\'t',
            'should\'ve',
            'could\'ve',
            'would\'ve'
        ];
        const abrv = ['mr', 'ms', 'mrs', 'dr'];
        const multiwords = [
            'zip archive',
            'e-mail',
            'coup de etat',
            'kick-ass',
            'bad-ass',
            'goofy ahh',
            'goofy-ahh',
            'goofy-ass',
            'no one',
            'some one',
            'anti-virus',
            'black mail',
            'black mailed',
            'top secret',
            'google chrome',
            'google drive',
            'apple inc',
            'ublock origin',
            'microsoft windows',
            'tp-link',
            'tp-link ac1750',
            'tp-link ac 1750',
            'rose gold',
            'due to',
            'as well',
            'for real',
            'on crack',
            'on steroids',
            'all knowning',
            'all-knowing',
            'as hell',
            'as heck',
            'as frick',
            'as fuck',
            'señor', // in case
            'señora',
            'señorita',
            'pissed off',
            'nintendo switch',
            'wii u',
            'xbox one',
            'xbox live',
            'xbox 360',
            'apple music',
            'apple tv',
            'star wars',
            'united states',
            'united states of america',
            'united kingdom',
            'new zealand',
            'costa rica',
            'new jersey',
            'new york',
            'north dakota',
            'south dakota',
            'los angeles',
            'san jose',
            'las vegas',
            'south korea',
            'north korea',
            'hong kong',
            'jack-in-the-box',
            'jack sparrow',
            'dua lipa',
            'of course',
            'got it',
            'copy that',
            'all right',
            'thank you',
            'excuse me',
            'hell yeah',
            'hell nah',
            'hell no',
            'hell naw',
            'fire fox',
            'no-good',
            'ass-kissing',
        ];
        let fixed = [];
        let prevCont = false;
        for(var i = 0; i < words.length; i++) {
            if(words[i] === "'") {
                if(prevCont) {
                    prevCont = false;
                    if(contractions.includes(`${(words[i-1]||'').toLowerCase()}'${(words[i+1]||'').toLowerCase()}`)) {
                        fixed.push(`${words[i-1]}${words[i]}${words[i+1]}`);
                        i++;
                    } else {
                        fixed.push(words[i-1]);
                        fixed.push(words[i]);
                    }
                } else if(words[i+1] === 's') {
                    fixed.push("'s");
                    i++
                } else {
                    fixed.push("'");
                }
            } else if(prevCont) {
                prevCont = false;
                fixed.push(words[i-1]);
                fixed.push(words[i]);
            } else if(contractionHalfs.includes(words[i].toLowerCase())) {
                prevCont = true;
            } else if(words[i+1] === '.' && abrv.includes((words[i]||0).toLowerCase())) {
                fixed.push(words[i]+words[i+1]);
                i++;
            } else if(multiwords.includes(words.slice(i,i+3).join('').toLowerCase())) {
                fixed.push(words.slice(i, i+3).join(''));
                i += 2;
            } else if(multiwords.includes(words.slice(i,i+5).join('').toLowerCase())) {
                fixed.push(words.slice(i,i+5).join(''));
                i += 4;
            } else if(multiwords.includes(words.slice(i,i+7).join('').toLowerCase())) {
                fixed.push(words.slice(i,i+7).join(''));
                i += 6;
            } else if(words[i] === '-' && ['chan','san','kun','tan','sama','senpai','sensei','kum','niisan','neesan','niichan','neechan','oniisan','oneesan','oniichan','oneechan','onichan','onechan'].includes((words[i+1]||'').toLowerCase())) {
                fixed.push(words[i]+words[i+1]);
                i++;
            } else {
                fixed.push(words[i]);
            }
        }
        if(prevCont) {
            fixed.push(words[i-1]);
        }
        return fixed;
    };

    function parseEnglish (text="") {
        const words = matchEnglish(text);
        let output = [];
        let prev0;
        let prev1;
        let current;
        for(var i = 0; i < words.length; i++) {
            prev0 = (words[i-2]||'').toLowerCase(), prev1 = (words[i-1]||'').toLowerCase(), current = words[i].toLowerCase();
            if([
                ',', '.', '?', '!', ':', '"', '\'', ';'
            ].includes(current)) {
                output.push({
                    type: 'symbol',
                    word: words[i]
                });
            } else if(ENGLISH_NOUNS.includes(current) || ENGLISH_PROPER_NOUNS.includes(current)) {
                if(ENGLISH_PROPER_NOUNS.includes(current)) {
                    output.push({
                        type: 'proper-noun',
                        word: words[i]
                    });
                } else if(ENGLISH_VERBS.includes(current)) {
                    if(ENGLISH_ADJECTIVES.includes(current) && (
                        ['a','an','of','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike','you'].includes(prev0) || !isNaN(prev0)) && !((ENGLISH_VERBS.includes(prev0) && !ENGLISH_ADVERBS.includes(prev0)) || (['i\'m','you\'re','it\'s','that\'s','he\'s','we\'re','she\'s','they\'re'].includes(prev0))) && words[i+2] && (ENGLISH_PROPER_NOUNS.includes((words[i+2]||'').toLowerCase()) || ENGLISH_NOUNS.includes((words[i+2]||'').toLowerCase()) || ENGLISH_ADJECTIVES.includes((words[i+2]||'').toLowerCase())) && !(words[i+1] && '.?!;,:'.split('').includes(words[i+1]))) {
                        output.push({
                            type: 'adjective',
                            word: words[i]
                        });
                    } else if((prev0 && (
                        ENGLISH_VERBS.includes(prev0)
                        || ['a','an','of','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike'].includes(prev0)
                        || !isNaN(prev0)
                    )) && !(words[i+2] && (['a','an','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s", 'it','everything','me','myself','yourself','he','she','they','you','them','him','her'].includes((words[i+2]||'').toLowerCase()) || !isNaN(words[i+2]||NaN) || ENGLISH_NOUNS.includes((words[i+2]||'').toLowerCase())))) {
                        output.push({
                            type: 'noun',
                            word: words[i]
                        });
                    } else if(ENGLISH_ADJECTIVES.includes(current) && (
                            ENGLISH_NOUNS.includes(words[i+1]) || (prev0 && (
                            ENGLISH_ADJECTIVES.includes(prev0)
                            || ['a','an','of','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike', 'you'].includes(prev0)
                            || !isNaN(prev0)
                        ) && !(words[i+1] && '.?!;,:'.split('').includes(words[i+1])))
                    )) {
                        output.push({
                            type: 'adjective',
                            word: words[i]
                        });
                    } else if(!(prev0 && ['a','an','of','the','some','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike','you'].includes(prev0))) {
                        output.push({
                            type: 'verb',
                            word: words[i]
                        });
                    } else {
                        output.push({
                            type: 'noun',
                            word: words[i]
                        });
                    }
                } else if(ENGLISH_ADJECTIVES.includes(current)) {
                    if(ENGLISH_NOUNS.includes(words[i+1]) || (prev0 && (
                        ENGLISH_ADJECTIVES.includes(prev0)
                        || ['a','an','of','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike'].includes(prev0)
                        || !isNaN(prev0)
                    ))) {
                        output.push({
                            type: 'adjective',
                            word: words[i]
                        });
                    } else {
                        output.push({
                            type: 'noun',
                            word: words[i]
                        });
                    }
                } else {
                    output.push({
                        type: 'noun',
                        word: words[i]
                    });
                }
            } else if(ENGLISH_VERBS.includes(current)) {
                if(ENGLISH_ADJECTIVES.includes(current) && (
                    ['a','an','of','the','some','this','that','these','those','my','your','his','her','their','its','our',"'s",'will','to','like','hate','dislike','you'].includes(prev0) || !isNaN(prev0) || ENGLISH_PROPER_NOUNS.includes((words[i+2]||'').toLowerCase()) || ENGLISH_NOUNS.includes((words[i+2]||'').toLowerCase()) || ENGLISH_ADJECTIVES.includes((words[i+2]||'').toLowerCase())) && !((ENGLISH_VERBS.includes(prev0)&&!ENGLISH_ADVERBS.includes(prev0)) || (['i\'m','you\'re','it\'s','that\'s','he\'s','we\'re','she\'s','they\'re'].includes(prev0))) ) {
                    output.push({
                        type: 'adjective',
                        word: words[i]
                    });
                } else if(ENGLISH_ADVERBS.includes(current) && (
                    ENGLISH_VERBS.includes((words[i+2]||'').toLowerCase())
                )) {
                    output.push({
                        type: 'adverb',
                        word: words[i]
                    });
                } else {
                    output.push({
                        type: 'verb',
                        word: words[i]
                    });
                }
            } else if(ENGLISH_ADJECTIVES.includes(current)) {
                output.push({
                    type: 'adjective',
                    word: words[i]
                });
            } else if(ENGLISH_ADVERBS.includes(current)) {
                output.push({
                    type: 'adverb',
                    word: words[i]
                });
            } else if(ENGLISH_PARTICLES.includes(current)) {
                output.push({
                    type: 'particle',
                    word: words[i]
                });
            } else if(ENGLISH_EXCLAMATIONS.includes(current)) {
                output.push({
                    type: 'burst',
                    word: words[i]
                });
            } else {
                output.push({
                    type: 'other',
                    word: words[i]
                });
            }
        }
        return output;
    };

    function generateColorizedHTMLForEnglish (text="") {
        const parsed = parseEnglish(text);
        let out = "";
        for(var i = 0; i < parsed.length; i++) {
            out += "<span class='ifd-text";
            if(parsed[i].type === 'noun') {
                out += " ifd-noun";
            } else if(parsed[i].type === 'adjective') {
                out += " ifd-adjective"
            } else if(parsed[i].type === 'verb') {
                out += " ifd-verb";
            } else if(parsed[i].type === 'adverb') {
                out += " ifd-adverb"
            } else if(parsed[i].type === 'particle') {
                out += " ifd-particle";
            } else if(parsed[i].type === 'proper-noun') {
                out += " ifd-proper-noun";
            } else if(parsed[i].type === 'honorific' || ['-san','-chan','-kun','-sama','-tan','-sensei','-senpai'].includes(parsed[i].word) || ENGLISH_HONORIFICS.includes(parsed[i].word.toLowerCase())) {
                out += " ifd-honorific";
            } else if(parsed[i].type === 'burst') {
                out += " ifd-burst";
            }
            if(ENGLISH_MISTAKES.includes(parsed[i].word.toLowerCase())) {
                out += " ifd-error";
            } else if((parsed[i].type === 'verb' && (parsed[i].word.endsWith('ing')||parsed[i].word.endsWith('ed')||[
                'ran',
                'ate',
                'smote',
                'fought',
                'saw',
                'heard',
                'went',
                'gone',
                'did',
                'done',
                'said',
                'am',
                'are',
                'is',
                'was',
                'were',
                'had',
                'got',
                'thought'
            ].includes(parsed[i].word)) && parsed[i-2] && [
                'gonna',
                'i\'ll',
                'he\'ll',
                'to',
                'wanna',
                'finna',
                'will',
                'you\'ll',
                'she\'ll',
                'they\'ll',
                'it\'ll',
                'that\'ll'
            ].includes(parsed[i-2].word))) {
                out += ' ifd-warning'
            }
            if(ENGLISH_FORIEGN.includes(parsed[i].word.toLowerCase())) {
                out += " ifd-foriegn";
            }
            if(!(
                ENGLISH_ALL.includes(parsed[i].word.toLowerCase())
                ||
                ('?!.,[]{}()\'";:/\\<>+=-_~! &%$#@*^').includes(parsed[i].word)
            )) {
                if(parsed[i].word[0] && parsed[i].word[0].toUpperCase() == parsed[i].word[0]) {
                    out += ' ifd-proper-noun ifd-custom-noun';
                } else {
                    out += " ifd-gone";
                }
            }
            out += "'>";
            out += parsed[i].word.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt');
            out += "</span>";
        }
        return out;
    };

    return { generateColorizedHTMLForEnglish }
};
