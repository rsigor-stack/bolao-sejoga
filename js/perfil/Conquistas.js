Bolao.events.on(

    "perfil:changed",

    ({ participante, dados }) => {

        Bolao.perfil.conquistas.render(

            participante,

            dados

        );

    }

);
