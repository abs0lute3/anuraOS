(() => {
	window.addEventListener("beforeunload", (event) => {
		event.preventDefault();
		event.returnValue = "";
	});

	const installDialog = document.getElementById("anura-install-dialog");
	const installButton = document.getElementById("anura-install-button");
	if (!installDialog || !installButton) return;

	let installPrompt = null;

	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();
		if (window.matchMedia("(display-mode: standalone)").matches) return;
		installPrompt = event;
		if (typeof installDialog.showModal === "function") {
			installDialog.showModal();
		}
	});

	installButton.addEventListener("click", async () => {
		if (!installPrompt) {
			if (typeof installDialog.close === "function") installDialog.close();
			return;
		}

		const prompt = installPrompt;
		installPrompt = null;
		installButton.disabled = true;

		try {
			prompt.prompt();
			await prompt.userChoice;
		} catch (error) {
			console.error("Unable to prompt for AnuraOS installation", error);
		} finally {
			installButton.disabled = false;
			if (typeof installDialog.close === "function") installDialog.close();
		}
	});
})();
