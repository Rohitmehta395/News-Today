class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
  }

  searchPrefix(prefix, limit = 10) {
    let node = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this._collectWords(node, prefix.toLowerCase(), limit);
  }

  _collectWords(node, prefix, limit, results = []) {
    if (results.length >= limit) return results;

    if (node.isEnd) results.push(prefix);

    for (let char in node.children) {
      if (results.length >= limit) break;
      this._collectWords(node.children[char], prefix + char, limit, results);
    }

    return results;
  }
}

export default Trie;
