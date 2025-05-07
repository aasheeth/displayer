const PluginManager = {
  plugins: {},

  registerPlugin(contentType, plugin) {
    this.plugins[contentType] = plugin;
  },

  getPlugin(contentType) {
    if (!contentType) return null;
    const normalized = contentType.split(';')[0].trim();
    return this.plugins[normalized];
  }
  
};

export default PluginManager;
