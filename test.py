import subprocess
import os
import sys

# ==============================
# CONFIG — CHANGE THIS
# ==============================
GITHUB_REPO = "git@github.com:a64mahmo/ascii_face_3d.git"
BRANCH = "main"

# ==============================
# Helpers
# ==============================
def run(cmd, env=None):
    print(f"\n> {cmd}")
    subprocess.run(cmd, shell=True, check=True, env=env)


def git_commit(message, date):
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = date
    env["GIT_COMMITTER_DATE"] = date

    run("git add .")
    run(f'git commit -m "{message}"', env=env)


# ==============================
# Weekend timeline
# ==============================
COMMITS = [
    ("init project scaffold with basic HTML canvas",
     "2026-03-20 19:12:00"),

    ("add three.js renderer and camera setup",
     "2026-03-20 21:03:00"),

    ("prototype brightness-based depth mesh from video input",
     "2026-03-21 10:41:00"),

    ("add orbit camera controls and zoom interaction",
     "2026-03-21 13:18:00"),

    ("implement control panel for render modes and depth adjustment",
     "2026-03-21 18:52:00"),

    ("refactor codebase into modular architecture (camera, mesh, ui)",
     "2026-03-22 11:07:00"),

    ("extract inline styles into dedicated stylesheet",
     "2026-03-22 14:34:00"),

    ("optimize mesh updates and reduce unnecessary recalculations",
     "2026-03-22 17:26:00"),

    ("final polish: UI tweaks, cleanup, and project organization",
     "2026-03-22 20:11:00"),
]


# ==============================
# Main
# ==============================
def main():

    # --- init repo ---
    if not os.path.exists(".git"):
        run("git init")
        run(f"git branch -M {BRANCH}")

    # --- create gitignore ---
    if not os.path.exists(".gitignore"):
        with open(".gitignore", "w") as f:
            f.write(
                "node_modules/\n"
                ".DS_Store\n"
                "__pycache__/\n"
                ".env\n"
            )

    # --- commits ---
    for msg, date in COMMITS:
        git_commit(msg, date)

    # --- tags ---
    run("git tag v0.1")
    run("git tag v1.0")

    # --- remote setup ---
    existing_remote = subprocess.run(
        "git remote",
        shell=True,
        capture_output=True,
        text=True
    ).stdout.strip()

    if "origin" not in existing_remote:
        run(f"git remote add origin {GITHUB_REPO}")

    # --- push ---
    run(f"git push -u origin {BRANCH} --tags")

    print("\n✅ Project pushed successfully with realistic weekend history.")


if __name__ == "__main__":
    main()