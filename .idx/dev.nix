# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.sudo
    pkgs.nodejs_20
    pkgs.jre
    pkgs.python3
    pkgs.cmake
    pkgs.gnumake42
    pkgs.gcc
    
  ];

  # Sets environment variables in the workspace
  env = { };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "christian-kohler.npm-intellisense"
      "christian-kohler.path-intellisense"
      "dbaeumer.vscode-eslint"
      "dsznajder.es7-react-js-snippets"
      "eamodio.gitlens"
      "esbenp.prettier-vscode"
      "gengjiawen.vscode-postfix-ts"
      "Gydunhn.javascript-essentials"
      "Gydunhn.typescript-essentials"
      "ms-vscode.vscode-typescript-next"
      "PKief.material-icon-theme"
      "rvest.vs-code-prettier-eslint"
      "tombonnike.vscode-status-bar-format-toggle"
      "usernamehw.errorlens"
      "xabikos.JavaScriptSnippets"
      "YoavBls.pretty-ts-errors"
      "zhuangtongfa.material-theme"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # web = {
        #   # Example: run "npm run dev" with PORT set to IDX's defined port for previews,
        #   # and show it in IDX's web preview panel
        #   command = ["npm" "run" "dev"];
        #   manager = "web";
        #   env = {
        #     # Environment variables to set for your server
        #     PORT = "$PORT";
        #   };
        # };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
      };
    };
  };
}
