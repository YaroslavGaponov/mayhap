/*
 * MayHap - a quick search for the word in his top
 */
(function() {
    var BitSet = function(data) {
        if (this instanceof BitSet) {
            this.data = data || {};
        } else {
            return new BitSet();
        }
    }

    BitSet.prototype.add = function(id) {
        var idx = id >>> 5;
        var bit = 1 << (id & 0x1f);
        if (!this.data[idx]) {
            this.data[idx] = bit;
        } else {
            this.data[idx] |= bit;
        }
        return this;
    }

    BitSet.prototype.remove = function(id) {
        var idx = id >>> 5;
        var bit = 1 << (id & 0x1f);
        if (this.data[idx]) {
            this.data[idx] &= ~bit;
        }
        if (!this.data[idx]) {
            delete this.data[idx];
        }
        return this;
    }

    BitSet.prototype.length = function() {
        var _bits = function(n) {
            var table = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8];
            return table[n & 0xff] + table[(n >> 8) & 0xff] + table[(n >> 16) & 0xff] + table[(n >> 24) & 0xff];
        }

        var length = 0;
        for (var idx in this.data) {
            length += _bits(this.data[idx]);
        }
        return length;

    }

    BitSet.prototype.forEach = function(iterator) {
        search: for (var idx in this.data) {
            for (var n = 0; n < 32; n++) {
                var bit = 1 << n;
                if ((this.data[idx] & bit) == bit) {
                    if (!iterator((idx << 5) | n)) {
                        break search;
                    };
                }
            }
        }
    }

    var Index = function() {
        if (this instanceof Index) {
            this.index = {};
        } else {
            return new Index();
        }
    }

    Index.prototype.add = function(key, id) {
        this.index[key] = (this.index[key] || new BitSet()).add(id);
        return this;
    }

    Index.prototype.remove = function(key, id) {
        if (key in this.index) {
            this.index[key].remove(id);
        }
        return this;
    }

    Index.prototype.get = function(key, length) {

        if (!this.index[key]) {
            return [];
        }

        if (length) {
            length = Math.min(length, this.index[key].length());
        } else {
            length = this.index[key].length();
        }

        var curr = 0;
        var array = new Array(length);
        this.index[key].forEach(function(indx) {
            array[curr++] = indx;
            return (curr < length);
        });

        return array;
    }


    var Mayhap = function() {
        if (this instanceof Mayhap) {
            this.words = [];
            this.index = new Index();
        } else {
            return new Mayhap();
        }
    }

    Mayhap.prototype.add = function(word) {
        var id = this.words.indexOf(word);
        if (id < 0) {
            id = this.words.length;
            this.words.push(word);
        }

        for (var i = 1; i < word.length; i++) {
            this.index.add(word.substring(0, i), id);
        }
        return this;
    }


    Mayhap.prototype.remove = function(word) {
        var id = this.words.indexOf(word);
        if (id >= 0) {
            for (var i = 1; i < word.length; i++) {
                this.index.remove(word.substring(0, i), id);
            }
        }
        return this;
    }


    Mayhap.prototype.suggest = function(text, length) {
        var ids = this.index.get(text, length);
        var array = new Array(ids.length);
        for (var i = 0; i < array.length; i++) {
            array[i] = this.words[ids[i]];
        }
        return array;
    }

    ;
    (function(root, factory) {
        if (typeof exports === 'object') {
            module.exports = factory();
        } else {
            root.MAYHAP = factory();
        }
    }(this, function() {
        return Mayhap;
    }))
})()