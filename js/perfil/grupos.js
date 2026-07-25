Bolao.events.on(

    "perfil:changed",

    ({ participante, dados }) => {

        Bolao.perfil.grupos.render(

            participante,

            dados

        );

    }

);
