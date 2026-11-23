type Cleanup = () => Promise<void> | void;

const cleanup: Cleanup[] = [];

export const onShutdown = (fn: Cleanup) => {
    cleanup.push(fn);
};

export async function runCleanups() {
    // reverse order, last thing is cloased first
    for (const fn of [...cleanup].reverse()) {
        try {
            await fn();
        } catch (err) {
            console.error("Cleanup failed: ", err);
        }
    }
}
