import { SimplePool } from 'nostr-tools';

const defaultPool = new SimplePool({batchInterval: 10});

export default defaultPool;
