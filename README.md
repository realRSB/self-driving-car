I'm done with part 1 of 2 of this simulation. Currently, I've completed the car movement, collision, and rays, but still need to implement the neural network.

# Self-Driving Car Simulation 🚗💨

This is a JavaScript-based self-driving car simulation built from scratch — no libraries, no frameworks. It uses basic physics, pathfinding, and sensor logic to simulate AI-controlled vehicles navigating a road with traffic.

## 🔧 Features

- Vanilla JavaScript — no external dependencies
- Neural network driving logic
- Real-time sensor visualization
- Custom road generation and lane logic
- Traffic vehicles to avoid collisions
- Save & load trained AI brains with `localStorage`

## 🧠 How It Works

The car uses simulated sensors (rays) to detect road borders and traffic, feeding the data into a neural network that decides steering inputs. The network evolves over time to improve performance.


## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/realRSB/self-driving-car.git
Open index.html in your browser.

Train your AI and watch it drive smarter each time.

**📦 Credits
Built with guidance from Radu Rădeanu’s tutorial and extended with personal improvements.**
