# PAF-IAST Transportation System

The **PAF-IAST Transportation System** is a web-based application built to manage and automate student transportation within a university. This system allows the university administration to efficiently manage student registrations, bus route assignments, fee tracking, and the generation of unique QR codes for fee validation, all within a single platform.

The project is developed using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) and styled with **Tailwind CSS** for responsive design and ease of customization. The system offers both backend and frontend functionalities, making it a scalable solution for future growth.

### Features

- **Route Management (CRUD)**: Add, update, delete, and view bus routes and buses assigned to them.
- **Student Registration & Management (CRUD)**: Register students, update their data, and manage their assigned routes.
- **Fee Tracking**: Track student fee payments, mark them as paid/unpaid, and generate reports on the fee status.
- **QR Code Generation**: Generate unique QR codes linked to each student’s fee status for quick validation at bus boarding.
- **User Role Management**: Different roles (Admin, Bus Staff, Bank Staff) with varying access to features based on their permissions.

### Technology Stack

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## DEMO (https://paf-transport.vercel.app/)
 - For admin use email: admin@test.com and password: 12345678
 - For bank use email: bank1@test.com and password: 12345678
 - For admin use email: driver6@test.com and password: 12345678

---

## Clone and Install

### 1. Clone the Repository

To get started with the **PAF-IAST Transportation System**, follow these steps to clone the repository:

```bash
git clone https://github.com/just-abdullah-dev/paf-transport.git
cd paf-transport
```

### 2. Install Dependencies

Once you have the project cloned, navigate into the project folder and run the following command to install the necessary dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory of your project and define the following environment variables. These are needed to set up the database and server configuration.
see env.example

Replace the `MONGO_URI` value with your MongoDB connection string.

---

## Run the Development Server

### Windows:

To run the project locally, open a command prompt and navigate to the root directory of your project. Then, run the following command to start the development server:

```bash
npm run dev
```


### macOS:

On macOS, follow the same steps to run the development server. Open the terminal and navigate to the project directory, then:

```bash
npm run dev
```

---

## Deploying to Vercel

### Windows and macOS:

To deploy the **PAF-IAST Transportation System** to **Vercel**, follow the steps below:

1. **Create a Vercel Account**  
   Go to [https://vercel.com](https://vercel.com) and create an account if you haven't already.

2. **Install Vercel CLI** (Optional, but recommended)  
   You can deploy directly from the terminal by installing the **Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

   Or, you can deploy directly from the Vercel web interface (see Step 4).

3. **Link Project with Vercel**  
   If using the Vercel CLI, navigate to the root of your project in the terminal and run:

   ```bash
   vercel login
   ```

   This command will prompt you to log into your Vercel account.

4. **Deploy Using Vercel CLI**  
   To deploy your project, simply run:

   ```bash
   vercel
   ```

   Follow the prompts to configure your project for deployment. Vercel will automatically deploy your app, giving you a public URL for your frontend and backend.

   If you're deploying through the Vercel web interface:

   - Go to the Vercel dashboard.
   - Click **New Project** and choose **Import GitHub Repository**.
   - Select your repository and configure the project (frontend should be set to Next.js).

5. **Set Up Environment Variables on Vercel**  
   - In the Vercel dashboard, navigate to your project and open the **Settings** page.
   - Go to the **Environment Variables** section.
   - Add the same environment variables that you used in your local environment.

6. **Enjoy Your Deployed App**  
   After deployment, Vercel will provide a live URL for both frontend and backend. 

---

## Usage

Once the project is set up locally or deployed, you can:

1. **Admin**: Add and manage students and bus routes, mark fees as paid/unpaid, and view reports.
2. **Bus Staff**: Scan QR codes to check if students have paid for transportation. Fee Track.
3. **Bank Staff**: Track fee statuses and update payment records.

Each user will have access based on their roles, ensuring privacy and security for student data.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
