import importlib

# List of packages to check
packages = [
    "flask",
    "flask_cors",
    "torch",
    "torchvision",
    "pillow",
    "psutil",
    "pandas",
    "numpy",
    "matplotlib",
    "torchsummary"
]

# Function to check the version of a package
def check_version(package_name):
    try:
        module = importlib.import_module(package_name)
        version = getattr(module, '__version__', 'Version not found')
        print(f"{package_name}: {version}")
    except ImportError:
        print(f"{package_name}: Not installed")

# Check versions for each package
for package in packages:
    check_version(package)
