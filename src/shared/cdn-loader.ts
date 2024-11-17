export function loadStyle(href: string) {
    return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) {
            return resolve();
        }

        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
        document.head.appendChild(link);
    });
}

export function loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}