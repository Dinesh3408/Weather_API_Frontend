class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        const normalizedWord = word.toLowerCase();
        for (const char of normalizedWord) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.originalWord = word; // Store the original case for display
    }

    search(prefix) {
        let node = this.root;
        const normalizedPrefix = prefix.toLowerCase();
        for (const char of normalizedPrefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this._collectWords(node, []);
    }

    _collectWords(node, results) {
        if (node.isEndOfWord) {
            results.push(node.originalWord);
        }

        // Limit results to top 5 for better UI
        if (results.length >= 5) return results;

        for (const char in node.children) {
            this._collectWords(node.children[char], results);
            if (results.length >= 5) break;
        }
        return results;
    }
}
