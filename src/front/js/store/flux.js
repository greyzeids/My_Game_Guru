const apiUrl = process.env.BACKEND_URL + "/api";

const getState = ({ getStore, getActions, setStore }) => {

	return {
		store: {
			token: null,
			appidsGame:null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			getSuggestions:async (userPrompt) => {
				try {
					// let storageToken = localStorage.getItem("token");
					// if (!storageToken) 
					// 	return JSON.stringify({ "msg": "you must have a user for this function"});

					// setStore({ token: storageToken });

					let response = await fetch(apiUrl + "/suggestions", {
						method: "POST",
						headers: {
							// Authorization : "Bearer " + storageToken,
							"Content-Type" : "application/json"
						},
						body: JSON.stringify({ "user_prompt" : userPrompt })
					});

					let data = await response.json();
					let gameListString = data.recommendations[0].message.content;

					const gameList = gameListString.split(" ");
					setStore({ appidsGame: gameList });

					return true
					
				} catch (error) {
					console.error(`Promise error: ${error}`);
				}
				
				
			},

			getGameDetails: async (gameID) => {
				try {
				  let response = await fetch(STEAM_API_URL+gameID);
				  if (!response.ok) {
					console.error(`Error Request: ${response.status}`);
					return;
				  }
				  let data = await response.json();
		
				  return data;
				} catch (error) {
				  console.error(`Promise error: ${error}`);
				}
			  },
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


            // Función para obtener un mensaje del backend
            getMessage: async () => {
                try {
                    // Realiza una solicitud al backend para obtener un mensaje
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error al cargar el mensaje desde el backend", error);
                }
            },

            // Función para cambiar el color de los elementos demo
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            // Nueva función para registrar un usuario
            signup: async (userData) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(userData)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.msg || "Error en el registro");
                    }

                    return data;
                } catch (error) {
                    console.log("Error en el registro:", error);
                    return { msg: error.message };
                }
            }
        }
    };
};

export default getState;
