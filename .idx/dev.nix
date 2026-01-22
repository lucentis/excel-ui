{ pkgs, ... }: {
  # Canal stable de nixpkgs
  channel = "stable-24.05";
  
  # Packages nécessaires pour le projet
  packages = [
    pkgs.nodejs_22  # Node.js 22 (requis pour Vite 7 et dépendances)
  ];
  
  # Configuration IDX
  idx = {
    # Extensions VS Code recommandées
    extensions = [
      "Vue.volar"              # Vue Language Features
      "Vue.vscode-typescript-vue-plugin"  # TypeScript pour Vue
      "dbaeumer.vscode-eslint" # ESLint
      "esbenp.prettier-vscode" # Prettier
    ];
    
    # Configuration du workspace
    workspace = {
      # Commandes à exécuter lors de la création du workspace
      onCreate = {
        npm-install = "npm install";
      };
      
      # Commandes à exécuter à chaque ouverture
      onStart = {
        # Optionnel: lancer le dev server automatiquement
        # dev-server = "npm run dev";
      };
    };
    
    # Configuration des previews (serveur de dev)
    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "npm"
            "run"
            "dev"
            "--"
            "--port"
            "$PORT"
            "--host"
            "0.0.0.0"
          ];
          manager = "web";
          env = {
            # Variables d'environnement si nécessaire
            # PORT = "$PORT";
          };
        };
      };
    };
  };
}