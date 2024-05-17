document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelectorAll(".textarea")[1];
    const prefill = textarea.querySelector("#prefill");
    const editor = textarea.querySelector("[contenteditable]");
    const menu = document.querySelector("[data-context-menu]");
    const pasteButton = document.querySelector("[data-action='paste']");
    const selectButton = document.querySelector("[data-action='selectall']");
    const label = document.querySelector("label[for='editable']");
    const basicTextarea = document.querySelector("textarea");

    // Focus the editable element when you click anywhere in the textarea

    document.querySelectorAll(".textarea").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            // Find the first editable element and focus it.
            el.querySelector("[contenteditable], textarea").focus();
        });
    });

    if (
        navigator.clipboard &&
        navigator.permissions &&
        navigator.permissions.query
    ) {
        // If we right-click in an area of the div that's not covered by an input element,
        // we need to present an option to paste content.
        textarea.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            menu.classList.remove("hidden");
        });
        editor.addEventListener("contextmenu", (e) => {
            e.stopPropagation();
        });
        pasteButton.addEventListener("click", async (e) => {
            menu.classList.add("hidden");
            editor.focus();
            try {
                const permission = await navigator.permissions.query({
                    name: "clipboard-read"
                });
                if (permission.state === "denied") {
                    alert("Clipboard permission denied :(");
                } else {
                    navigator.clipboard.readText().then((text) => {
                        text = text.replace(/<[^>]*>?/gm, "");
                        document.execCommand("insertHTML", false, text);
                    });
                }
            } catch {
                alert("Clipboard permissions not supported in this browser");
            }
        });

        window.addEventListener("click", (e) => {
            if (!menu.classList.contains("hidden")) {
                if (!e.target.closest("[data-context-menu]")) {
                    menu.classList.add("hidden");
                }
            }
        });
    }

    selectButton.addEventListener("click", () => {
        menu.classList.add("hidden");
        editor.focus();
        window.getSelection().selectAllChildren(editor);
    });

    // Force any test pasted to be plain text
    editor.addEventListener("paste", (e) => {
        e.preventDefault();
        let text = (e.clipboardData || window.clipboardData).getData("text/plain");
        // Get rid of any HTML tags present
        text = text.replace(/<[^>]*>?/gm, "");
        // insert text manually
        document.execCommand("insertHTML", false, text);
    });

    const resizeTextarea = () => {
        basicTextarea.style.height = "auto";
        basicTextarea.style.height = basicTextarea.scrollHeight + "px";
    };

    basicTextarea.addEventListener("input", resizeTextarea);
    resizeTextarea();

    label.addEventListener("click", () => editor.focus());
});