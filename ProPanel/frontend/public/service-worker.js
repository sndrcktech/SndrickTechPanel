self.addEventListener("push", function(event) {
  const data = event.data ? event.data.text() : "Новое уведомление";
  event.waitUntil(
    self.registration.showNotification("SandrickTechPanel", {
      body: data,
      icon: "/icon-192.png"
    })
  );
});
