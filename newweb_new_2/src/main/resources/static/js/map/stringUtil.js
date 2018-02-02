
var formats = {
            '%': function(val) { return '%'; },
            'b': function(val) { return parseInt(val, 10).toString(2); },
            'c': function(val) { return String.fromCharCode(parseInt(val, 10)); },
            'd': function(val) { return parseInt(val, 10) ? parseInt(val, 10) : 0; },
            'u': function(val) { return Math.abs(val); },
            'f': function(val, p) { return (p > -1) ? Math.round(parseFloat(val) * Math.pow(10, p)) / Math.pow(10, p) : parseFloat(val); },
            'o': function(val) { return parseInt(val, 10).toString(8); },
            's': function(val) { return val; },
            'S': function(val, p) { var len = p - val.toString().length; for (i = 0; i < len; i++) val = '0' + val; return val; },
            'x': function(val) { return ('' + parseInt(val, 10).toString(16)).toLowerCase(); },
            'X': function(val) { return ('' + parseInt(val, 10).toString(16)).toUpperCase(); }
        };

        var re = /%(?:(\d+)?(?:\.(\d+))?|\(([^)]+)\))([%bcdufosSxX])/g;

        var dispatch = function(data) {
            if (data.length == 1 && typeof data[0] == 'object') {
                data = data[0];
                return function(match, w, p, lbl, fmt, off, str) {
                    return formats[fmt](data[lbl]);
                };
            } else {
                var idx = 0;
                return function(match, w, p, lbl, fmt, off, str) {
                    return formats[fmt](data[idx++], p);
                };
            }
        };

        String.prototype.sprintf = function() {
            //var argv = Array.apply(null, arguments);
            return this.replace(re, dispatch(arguments));
        }
        String.prototype.vsprintf = function(data) {
            return this.replace(re, dispatch(data));
        }
/*** eg: 
        var classixxc = '%.5S'.sprintf(10);
        alert(classixxc)
        //classic = '00010'
        var classic = '%s %d% %.3f'.sprintf('string', 40, 3.141593);
        alert(classic)
        // classic = 'string 40% 3.142'
        var named = '%(name)s: %(value)d'.sprintf({ name: 'age', value: 40 });
        alert(named)
        //named = 'age: 40'
        //vsprintf
        var classisc = '%s %d% %.3f'.vsprintf(['string', 40, 3.141593]);
        alert(classisc)
        // classisc = 'string 40% 3.142'
***/